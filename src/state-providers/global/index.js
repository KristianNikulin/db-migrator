import { memo } from "react";
import { flow as pipe } from "lodash";

import { Noop } from "../../components/Noop";

import { withToastify } from "./tostify";

export const withGlobalContext = pipe(withToastify, memo);

export const GlobalContextProvider = withGlobalContext(Noop);
