export default function (
  imports: string,
  userModels: string,
  extraImports: string,
  extraModels: string
) {
  if (!extraImports && !imports) {
    return `import React from 'react';
export default ({ children }: { children: React.ReactNode }) => children
`
  }
  return `import React from 'react';
${extraImports}
${imports}
// @ts-ignore
import Dispatcher from './helpers/dispatcher';
// @ts-ignore
import Executor from './helpers/executor';
// @ts-ignore
import { UCContext } from './helpers/constant';

export const models = { ${extraModels ? `${extraModels}, ` : ''}${userModels} };

export type Model<T extends keyof typeof models> = {
  [key in keyof typeof models]: ReturnType<typeof models[T]>;
};

export type Models<T extends keyof typeof models> = Model<T>[T]

const dispatcher = new Dispatcher!();
const Exe = Executor!;

export default ({ children }: { children: React.ReactNode }) => {

  return (
    <UCContext.Provider value={dispatcher}>
      {
        Object.entries(models).map(pair => (
          <Exe key={pair[0]} namespace={pair[0]} hook={pair[1] as any} onUpdate={(val: any) => {
            const [ns] = pair as [keyof typeof models, any];
            dispatcher.data[ns] = val;
            dispatcher.update(ns);
          }} />
        ))
      }
      {children}
    </UCContext.Provider>
  )
}
`
}
