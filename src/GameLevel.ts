import { Paddle } from './GameObjects/Paddle'
import { Ball } from './GameObjects/Ball'
import { Brick } from './GameObjects/Brick'
import { Border } from './GameObjects/Border'
import { Painter } from './Painter'
import { Observable, Subscription, Scheduler } from 'rxjs'
import { Settings } from './Settings'
import { SoundDriver } from './SoundDriver'

const KEY_CODES = {
  ArrowLeft: 37,
  ArrowRight: 39
}

type PaddleDirection = -1 | 1 | 0

enum GameStatus {
  Win,
  Loose,
  Play
}

type BallDirection = {
  x: number,
  y: number
}

type Collisions = {
  brick: boolean,
  paddle: boolean,
  border: boolean
}

type GameState = {
  ball: Ball,
  bricks: Brick[],
  paddle: Paddle,
  ballDirection: BallDirection,
  collisions: Collisions,
  gameStatus: GameStatus
}

export class GameLevel {
  tick$: Observable<number>
  input$: Observable<PaddleDirection>
  paddle$: Observable<Paddle>
  gameState$: Observable<GameState>
  private borders: Border[]
  private gameSubscription: Subscription

  constructor(bricks: Brick[], private painter: Painter, private settings: Settings) {
    const { paddle, ball, borders } = this.createInitialObjects(settings)
    this.borders = borders

    this.tick$ = createTick$(settings.FRAME_RATE)
    this.input$ = createInput$()
    this.paddle$ = createPaddle$(this.tick$, this.input$, paddle, settings)

    this.gameState$ = this.tick$
      .withLatestFrom(this.paddle$)
      .scan(({ ball, bricks, ballDirection }, [tick, paddle]) =>
        this.handleGameTick(
          ball, tick, paddle, ballDirection,
          bricks, borders, settings.BALL_SPEED
        ), {
        ball,
        bricks,
        ballDirection: { x: -2, y: -2 },
        gameStatus: GameStatus.Play
      })
  }

  start() {
    this.gameSubscription = this.gameState$
      .subscribe(objects => {
        this.update(objects)
      })
  }

  dispose() {
    this.gameSubscription.unsubscribe()
  }

  private handleGameTick(ball: Ball,
                         tick: number,
                         paddle: Paddle,
                         ballDirection: BallDirection,
                         bricks: Brick[],
                         borders: Border[],
                         ballSpeed: number): GameState {
    let gameStatus = GameStatus.Play

    const collisions: Collisions = {
      brick: false,
      paddle: false,
      border: false
    }

    const possibleNextBall = ball.moveTo(
      ball.x + ballDirection.x * tick * ballSpeed,
      ball.y + ballDirection.y * tick * ballSpeed
    )

    const nextBallDirection = Object.assign({}, ballDirection)

    const survivedBricks: Brick[] = []
    bricks.forEach(brick => {
      if (possibleNextBall.collides(brick)) {
        nextBallDirection.y *= -1
        collisions.brick = true
      } else {
        survivedBricks.push(brick)
      }
    })

    if (!survivedBricks.length) {
      gameStatus = GameStatus.Win
    }

    const [leftB, topB, rightB, bottomB] = borders

    if (possibleNextBall.collides(leftB) || possibleNextBall.collides(rightB)) {
      nextBallDirection.x *= -1
      collisions.border = true
    }

    if (possibleNextBall.collides(topB)) {
      nextBallDirection.y *= -1
      collisions.border = true
    }

    if (possibleNextBall.collides(bottomB)) {
      gameStatus = GameStatus.Loose
    }

    if (possibleNextBall.collides(paddle)) {
      nextBallDirection.y *= -1
      nextBallDirection.x += (ball.x - paddle.x) / (paddle.width / 4)
      collisions.paddle = true
    }

    const nextBall = ball.moveTo(
      ball.x + nextBallDirection.x * tick * ballSpeed,
      ball.y + nextBallDirection.y * tick * ballSpeed
    )

    return {
      ball: nextBall,
      ballDirection: nextBallDirection,
      bricks: survivedBricks,
      paddle,
      gameStatus,
      collisions
    }
  }

  private createInitialObjects(settings) {
    const paddle = new Paddle(
      settings.CANVAS_WIDTH / 2,
      settings.CANVAS_HEIGHT - settings.PADDLE_HEIGHT,
      settings.PADDLE_WIDTH,
      settings.PADDLE_HEIGHT
    )

    const ball = new Ball(
      settings.CANVAS_WIDTH / 2,
      settings.CANVAS_HEIGHT - settings.PADDLE_HEIGHT * 2 - settings.BALL_RADIUS,
      settings.BALL_RADIUS
    )

    const borders = [
      new Border(
        0, settings.CANVAS_HEIGHT / 2,
        0, settings.CANVAS_HEIGHT
      ),
      new Border(
        settings.CANVAS_WIDTH / 2, 0,
        settings.CANVAS_WIDTH, 0
      ),
      new Border(
        settings.CANVAS_WIDTH, settings.CANVAS_HEIGHT / 2,
        0, settings.CANVAS_HEIGHT
      ),
      new Border(
        settings.CANVAS_WIDTH / 2, settings.CANVAS_HEIGHT,
        settings.CANVAS_WIDTH, 0
      )
    ]

    return { paddle, ball, borders }
  }

  private clearScreen() {
    this.painter
      .clearCanvas(this.settings.CANVAS_WIDTH, this.settings.CANVAS_HEIGHT)
  }

  private update({ paddle, ball, bricks, collisions, gameStatus }) {
    this.clearScreen()
    this.borders.forEach(this.painter.paint, this.painter)
    this.painter.paint(paddle)
    this.painter.paint(ball)
    bricks.forEach(this.painter.paint, this.painter)

    if (collisions.border) SoundDriver.play(45)
    if (collisions.paddle) SoundDriver.play(40)
    if (collisions.brick) {
      SoundDriver.play(47 + Math.floor(ball.y % 12))
    }

    if (gameStatus === GameStatus.Win) {
      this.dispose()
      SoundDriver.play(50)
    }

    if (gameStatus === GameStatus.Loose) {
      this.dispose()
      SoundDriver.play(40)
    }
  }
}

function createTick$(frameRate): Observable<number> {
  return Observable
    .interval(frameRate)
    .map(() => Date.now())
    .scan<number, [number, number]>((tupple, current) => [tupple[1], current], [Date.now(), Date.now()])
    .map(([prevTime, currentTime]) => (currentTime - prevTime) / 1000)
}

function createInput$(): Observable<PaddleDirection> {
  return Observable
    .merge(
      Observable.fromEvent(window, 'keydown', ({ keyCode }) =>
        keyCode === KEY_CODES.ArrowLeft  ? -1 :
        keyCode === KEY_CODES.ArrowRight ?  1 : 0
      ),
      Observable.fromEvent(window, 'keyup', event => 0)
    )
    .distinctUntilChanged()
}

function createPaddle$(tick$: Observable<number>,
                       input$: Observable<PaddleDirection>,
                       paddle: Paddle,
                       settings: Settings): Observable<Paddle> {
  return tick$
    .withLatestFrom(input$)
    .scan<[number, PaddleDirection], number>((position, [tick, direction]) => {
      const nextPos = position + direction * tick * settings.PADDLE_SPEED
      if (nextPos < 0 || nextPos > settings.CANVAS_WIDTH) {
        return position
      }
      return nextPos
    }, paddle.x)
    .startWith(paddle.x)
    .distinctUntilChanged()
    .map(x => paddle.moveTo(x, paddle.y))
}