import {take, put, call, fork, race, cancelled} from 'redux-saga/effects';
import {eventChannel, END} from 'redux-saga';
import {INCREMENT_ASYNC, INCREMENT, CANCEL_INCREMENT_ASYNC, COUNTDOWN_TERMINATED} from './actions';

const action = (type: string) => ({type});

const countdown = (secs: number) => {
  console.log('countdown', secs);

  return eventChannel(listener => {
      const iv = setInterval(() => {
        secs -= 1;

        console.log('countdown', secs);

        if (secs > 0) {
          listener(secs);
        }
        else {
          listener(END);

          clearInterval(iv);

          console.log('countdown terminated');
        }
      }, 1000);
      return () => {
        clearInterval(iv);
        console.log('countdown cancelled');
      }
    }
  )
};

export function* incrementAsync({value}: { value: number }) {
  const chan = yield call(countdown, value);

  try {
    while (true) {
      let seconds = yield take(chan);
      yield put({type: INCREMENT_ASYNC, value: seconds});
    }
  } finally {
    if (!(yield cancelled())) {
      yield put(action(INCREMENT));
      yield put(action(COUNTDOWN_TERMINATED));
    }

    chan.close();
  }
}

export function* watchIncrementAsync() {
  try {
    while (true) {
      const action = yield take(INCREMENT_ASYNC);

      // starts a 'Race' between an async increment and a user cancel action
      // if user cancel action wins, the incrementAsync will be cancelled automatically
      yield race({
        task: call(incrementAsync, action),
        cancel: take(CANCEL_INCREMENT_ASYNC),
      });

      // yield call(incrementAsync, action);
    }
  } finally {
    console.log('watchIncrementAsync terminated');
  }
}

export default function* rootSaga() {
  yield fork(watchIncrementAsync);
}
