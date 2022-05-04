import {createGlobalState} from 'react-hooks-global-state';

const {setGlobalState, getGlobalState} = createGlobalState({
    userData: {
        username: '',
        firstName: '',
        lastName: '',
        phone: ''
    },
    needUpdate: true
});

export {setGlobalState, getGlobalState};

