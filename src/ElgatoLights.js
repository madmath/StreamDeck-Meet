/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-invalid-this */

"use strict";

/**
 *
 * @module ElgatoLights
 */
class ElgatoLights {
  // eslint-disable-line
  #hubAddress;
  #apiKey;
  #autoLights = false;
  #ready = false;

  /**
   *
   */
  constructor() {
    try {
      //const hueConfig = JSON.parse(localStorage['msdHue']);
      const hueConfig = {};
      this.#hubAddress = "https://homeassistant.xxx.com/api/services/light/"; // hueConfig.address;
      this.#apiKey = "xxx"; //hueConfig.apiKey;
      //this.#lightId = hueConfig.lightId;
      this.#autoLights = hueConfig.autoOn ? true : false;
      if (this.#hubAddress && this.#apiKey) {
        this.#ready = true;
        return;
      }
    } catch (ex) {
      console.error("ElgatoLights error", ex);
    }
  }

  /**
   * Reports whether the Hue Lights API is available.
   *
   * @return {boolean}
   */
  get isAvailable() {
    return this.#ready;
  }

  /**
   * The lights should be turned on/off automatically.
   *
   * @return {boolean}
   */
  get auto() {
    return this.#autoLights;
  }

  async areOn() {
    const address =
      "https://homeassistant.xxx.com/api/states/light.elgato_key_light";
    this.#hubAddress;
    const key = this.#apiKey;
    //const lightId = this.#lightId;

    const url = address; // `https://${address}/api/${key}/lights/${lightId}/state`;
    const fetchOpts = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
    };
    try {
      return (await fetch(url, fetchOpts)).json();
    } catch (ex) {
      console.error("Unable to query Elgato light.", ex);
    }
  }

  /**
   * Turn the Hue light on or off
   *
   * @param {boolean} on Light state
   */
  async on(on) {
    if (!this.#ready) {
      return;
    }
    const address = this.#hubAddress;
    const key = this.#apiKey;
    //const lightId = this.#lightId;

    console.log("on state ", on);
    const url = on ? address + "turn_on" : address + "turn_off"; // `https://${address}/api/${key}/lights/${lightId}/state`;
    const hueCmd = { entity_id: "light.elgato_key_light" }; // on ? {on: true, ct: 250, bri: 100} : {on: false};
    const fetchOpts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(hueCmd),
    };
    try {
      await fetch(url, fetchOpts);
    } catch (ex) {
      console.error("Unable to toggle Elgato light.", ex);
    }
  }
}
