// This file ensures D1 bindings are available to Pages Functions
export default {
  async fetch(request, env) {
    // Pass through to Pages Functions
    return env.ASSETS.fetch(request);
  }
};
