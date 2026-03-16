interface TransitionConfig {
  target: string;
  guard: () => boolean;
}

interface StateConfig {
  entry?: () => void;
  on?: Record<string, TransitionConfig>;
  actions?: Record<string, () => void>;
}

interface MachineConfig {
  id: string;
  initial: string;
  states: Record<string, StateConfig>;
}

export class SimpleMachine {
  private currentState: string;
  private states: Record<string, StateConfig>;

  constructor(config: MachineConfig) {
    this.states = config.states;
    this.currentState = config.initial;
    this.states[this.currentState]?.entry?.();
  }

  send(event: { type: string }): void {
    const state = this.states[this.currentState];
    if (!state) return;

    const transition = state.on?.[event.type];
    if (transition && transition.guard()) {
      this.currentState = transition.target;
      this.states[this.currentState]?.entry?.();
      return;
    }

    const action = state.actions?.[event.type];
    if (action) {
      action();
    }
  }

  getSnapshot(): { value: string } {
    return { value: this.currentState };
  }
}
