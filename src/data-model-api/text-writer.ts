import { UniversalModel } from "./universal-model.ts";

  export interface TextWriter<T = UniversalModel>  {
      write(model: T): Promise<string>;
  }