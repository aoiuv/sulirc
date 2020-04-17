import { createMachine as Machine, interpret, assign } from "xstate";

const postUserAuthData = ({ account, password }) => {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve({
        msg: "login ok",
        code: 0,
        data: {
          token: `${account}/${password}.${Math.random().toString(32).substring(2)}`,
        },
      });
    } else {
      reject({
        msg: "login fail",
        code: -1,
      });
    }
  });
};

const setUserToken = assign({
  token: (_ctx, evt) => {
    return evt.data.data.token;
  },
});

const clearUserToken = assign({
  token: (_ctx, evt) => {
    return null;
  },
});

const updateTipMsg = assign({
  tipMsg: (ctx, evt) => {
    if (formIsInvalid(ctx)) {
      return "form invalid";
    }
    return evt.data.msg;
  },
});

const updateUserFormData = assign({
  account: (_ctx, evt) => {
    return evt.account;
  },
  password: (_ctx, evt) => {
    return evt.password;
  },
});

function formIsInvalid(ctx, evt) {
  return !(ctx.account && ctx.password);
}

const loginMachine = Machine(
  {
    id: "login",
    initial: "loggedOut",
    context: {
      account: null,
      password: null,
      token: null,
      tipMsg: "",
    },
    states: {
      loggedOut: {
        on: {
          SUBMIT: {
            target: "loading",
            actions: "updateUserFormData",
          },
        },
      },
      loading: {
        on: {
          "": {
            target: "loggedOut",
            actions: "updateTipMsg",
            cond: "formIsInvalid",
          },
        },
        invoke: {
          src: "login",
          onDone: {
            target: "loggedIn",
            actions: ["setUserToken", "updateTipMsg"],
          },
          onError: {
            target: "loggedOut",
            actions: ["clearUserToken", "updateTipMsg"],
          },
        },
      },
      loggedIn: {
        on: {
          LOGOUT: {
            target: "loggedOut",
            actions: "clearUserToken",
          },
        },
      },
    },
  },
  {
    services: {
      login: (ctx, evt) => {
        return postUserAuthData({
          account: ctx.account,
          password: ctx.password,
        });
      },
    },
    actions: {
      setUserToken,
      clearUserToken,
      updateTipMsg,
      updateUserFormData,
    },
    guards: {
      formIsInvalid,
    },
  }
);

const loginService = interpret(loginMachine);

loginService
  .onTransition((state) => {
    const { value, context } = state;
    // console.log(state._event);
    if (state.changed) {
      console.log("login value", value);
      console.log("login context", context);
    }
  })
  .start();

loginService.send("SUBMIT", {
  account: "sulirc",
  password: "qwer1234",
});

// setTimeout(() => {
//   loginService.send("LOGOUT");
// });
