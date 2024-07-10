import * as R from 'remeda';

// Re-export is super handy
export { v7 as uuidv7 } from 'uuid';

export const pluck = <T>(objs: T[], prop: keyof T) => R.pipe(objs, R.map(R.prop(prop)));
