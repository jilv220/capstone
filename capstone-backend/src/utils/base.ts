import * as R from 'remeda';

export const pluck = <T>(objs: T[], prop: keyof T) => R.pipe(objs, R.map(R.prop(prop)));
