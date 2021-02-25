const machineConfig = {
  id: 'signIn',
  context: {
    email: '',
    password: '',
  },
  initial: 'dataEntry',
  states: {
    awaitingResponse: {
      // Make a call to the authentication service      
      invoke: {
        src: 'requestSignIn',
        // If successful, move to the signedIn state
        onDone: {
          target: 'signedIn'
        },
        // If email input is unsuccessful, move to the emailErr.noAccount sub-state
        onError: [
          {
            cond: 'isNoAccount',
            target: 'emailErr.noAccount'
          },
          {
            // If password input is unsuccessful, move to the passwordErr.incorrect sub-state
            cond: 'isIncorrectPassword',
            target: 'passwordErr.incorrect'
          },
          {
            // If the service itself cannot be reached, move to the serviceErr state
            cond: 'isServiceErr',
            target: 'serviceErr'
          }
        ]
      },
    },
    dataEntry: {
      on: {
        ENTER_EMAIL: {
          actions: 'cacheEmail'
        },
        ENTER_PASSWORD: {
          actions: 'cachePassword'
        },
      },
        SUBMIT: [
          {
            cond: 'isBadEmailFormat',
            target: 'emailErr.badFormat'
          },
          {
            cond: 'isPasswordShort',
            target: 'passwordErr.tooShort'
          },
          {
            target: 'awaitingResponse'
          }
        ],
    },
    awaitingResponse: {},
    emailErr: {
      on: {
        ENTER_EMAIL: {
          actions: 'cacheEmail',
        }
      },
      initial: 'badFormat',
      states: {
        badFormat: {},
        noAccount: {},
      },
    },
    passwordErr: {
      on: {
        ENTER_PASSWORD: {
          actions: 'cachePassword',
          ...        
        }
      },
      initial: 'tooShort',
      states: {
        tooShort: {},
        incorrect: {},
      },
    },
    serviceErr: {
      on: {
        SUBMIT: {
          target: 'awaitingResponse',
        },
      },
    },
    signedIn: {},
  },
    signedIn: {
      type: 'final'
    },
    onDone: {
      actions: 'onAuthentication'
    },
};

export default machineConfig;
