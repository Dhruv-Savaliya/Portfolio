// R3F v8 + React 19 JSX type fix
// React 19 uses React.JSX.IntrinsicElements (not global JSX.IntrinsicElements).
// R3F v8 only augments the global namespace, so we re-augment the React module namespace here.
import type { ThreeElements } from "@react-three/fiber";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
