import {userIsRegistered, tratamentosDeErros} from './utils/api-utils.js';

userIsRegistered((response) => {},(response) => tratamentosDeErros.owner.register.donthaveregister(response));