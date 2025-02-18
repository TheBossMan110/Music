declare module 'noisejs' {
    export default class Noise {
      constructor(seed?: number);
      perlin2(x: number, y: number): number;
      perlin3(x: number, y: number, z: number): number;
      seed(seed: number): void;
    }
  }