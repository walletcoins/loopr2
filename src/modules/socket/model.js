

export default {
  namespace: 'socket',
  state: {
    socket:{},
    tickersByPair: [],
    tickersByLoopring:[],
    prices:[],
    assets:[],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === `/${MODULES}/list`) {
          dispatch({type: 'fetch'});
        }
      });
    },
  },
  effects: {
    *pageChange({payload},{call, select,put}){
      yield put({type:'pageChangeStart',payload});
      yield put({type:'fetch'});
    },
    *filtersChange({payload},{call, select,put}){
      yield put({type:'filtersChangeStart',payload});
      yield put({type:'fetch'});
    },
    *columnsChange({payload},{call, select,put}){
      // yield put({type:'pageChangeStart',payload});
      // yield put({type:'fetch'});
    },
    *sortChange({payload},{call, select,put}){
      yield put({type:'sortChangeStart',payload});
      yield put({type:'fetch'});
    },
    *queryChange({payload},{call, select,put}){
      yield put({type:'queryChangeStart',payload});
      yield put({type:'fetch'});
    },
    *fetch({ payload={} }, { call, select, put }) {
      yield put({ type: 'fetchStart',payload}); // model的state中传入各种参数的一个机会接口
      const {page,filters,sort,defaultState,originQuery} = yield select(({ [MODULES]:LIST }) => LIST );
      let new_payload = {page,filters,sort,originQuery};
      if(defaultState.filters){
        new_payload.filters={
          ...new_payload.filters,
          ...defaultState.filters
        }
      }

      const res = yield call(apis.fetchList, new_payload);
      if (res.items) {
        yield put({
          type: 'fetchSuccess',
          payload: {
            page:{
              ...page,
              ...res.page,
            },
            items:res.items,
            loading: false,
            loaded:true
          },
        });
      }
    },
  },
  reducers: {
    pricesChange(state, { payload }) {
      return {
        ...state,
        preference: {
          ...state.preference,
          ...payload
        }
      };
    },
  },
};
