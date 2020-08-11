# Code Review

## Architecture

### Dependencies

#### TypeScript

Good choice for modern frontend applications that aim to be
low-friction and leverage the most mature tools from the JavaScript
eco-system. The choice of `ts-loader` is also the most mature choice
for working with TypeScript.

#### Webpack

One of the most mature and flexible bundler and build toolchain
available.

#### RequireJS

Depending directly on RequireJS is redundant in the presence of
Webpack, and while Webpack comes with built-in RequireJS support,
newer module system exists and should be preferred.


### Approach and technology

#### Premise

A game written using HTML5 Canvas. Using canvas is an excellent
choice.

The application consists of three central abstractions including
canvas, grid, and app-runtime abstraction.

All three abstractions use class based objection orientation as
abstraction mechanism.

The dependency graph is not linear, but is unidirectional.

```
  ┌───────────────────────────┐
  │                           ▼
┌────────┐     ┌──────┐     ┌─────┐
│ Canvas │ ──▶ │ Grid │ ──▶ │ App │
└────────┘     └──────┘     └─────┘
```

##### Canvas

The canvas abstraction serves as a construction, like a factory
function and otherwise simply proxies properties of the provided
canvas. This makes using a class for abstraction of little utility.

The canvas constructor contains:

* 1 DOM side-effect
* 1 HTML5 canvas function call
* 3 property assignments

``` typescript
this.element = document.getElementById(elementId) as HTMLCanvasElement;
```

Having the constructor take an DOM-identity string as input and
calling the DOM query directly on the global document is less than
ideal as it creates a direct dependency on the global `document` and
also hinders usage in situations where the element is not mounted yet
or not in the global document (among numerous other
situations). Instead the constructor could preferably take an HTML
element as input.

The property `elementId` is unused yet assigned in the constructor.

The canvas abstraction serves to abstract the work done in the list
above, if we remove the DOM side effect and acknowledge that the class
properties provide no abstraction and just proxy `element` returned
from the side effect we can restructure the canvas class into a type
created using a simple function.

``` typescript
type Canvas =
	{ elem: HTMLCanvasElement, ctx: CanvasRenderingContext2D };

export const mkCanvas = (elem: HTMLCanvasElement): Canvas =>
    ({ elem, ctx: elem.getContext('2d') });
```

Now this combines just two pieces of data and involves just a single
function call to produce, so an abstraction is arguably not required
at all and the runtime abstraction could just as well depend on both
an `HTMLCanvasElement` and a `CanvasRenderingContext2D` separately.


##### Grid

The grid abstraction consists of one large class that deals with game
logic, drawing, and player interaction - all in one class.

There are a small set of types defined to formalize the game
state. Theses types do however mix information related to the game
logic and data required for rendering even if the render data is
derived from game state.

The complete game state is also not defined on its own but instead
implicitly in the properties of the class.

The cell state is defined using an enum with three values - the player
state is then defined as a hard-coded explicit subset of that enum.

This can be avoided by using sums in the definition of the cell state:

``` typescript
enum Player = { X, O };
type CellState = Player | null;
```

or more generically

``` typescript
enum PlayerId = string;
type CellState = PlayerId | null;
```

The game state can then be defined:

``` typescript
type BoardState = CellState[][];
type GameState = { turn: PlayerId, board: BoardState };
```

We could then define actions for updating the board state:

``` typescript
type Play = { player: PlayerId, pos: [number, number] };

type Action = Play;

const update = (action: Action, state: GameState): GameState => ...;
```

We can derive data from the game state:


``` typescript
const getWinner = (state: GameState): PlayerId | null => ...;
const isStalemate = (state: GameState): boolean => ...;
```

In general the grid class does too many things, does not abstract that
well and provides little separation between different layers of the
application. It also hard-codes most variables related to the game,
like board size.


##### App

The App class is quite simple and straight forward but does not have
any purpose in being a class. It implements delegation of function
calls that serves little purpose and could be omitted in favor of
using grid directly in the loop.


## Summary

I think the two biggest weaknesses of the code base is its data
modeling and lack of generality.

The data modeling is sparse and it doesn't leverage types and
functions enough. The types that do exist mix different types of data
and model multiple purposes. There are not enough high level types
that model the complete game state and no types to model user actions,
interactions and how the game is updated.

The code base has a lot of hard-coded values and it's not possible to
parameterize anything about the game.

It's a simple game so the generality can be forgiven - but with better
data modeling not only would the code be easier to read the code could
possibly also be shorter.
