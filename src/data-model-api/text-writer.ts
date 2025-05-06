import { UniversalModel } from "./universal-model.ts";

//ASK
/*export interface TextWriter {
    write(model: UniversalModel): Promise<string>;
  }*/

  export interface TextWriter<T = UniversalModel>  {
      write(model: T): Promise<string>;
  }