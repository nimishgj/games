/**
 * Base Game interface representing the common structure for all games
 */
export interface Game {
  name: string;
  description: string;
  initialize: () => void;
  reset: () => void;
}
