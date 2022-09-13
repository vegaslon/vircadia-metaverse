//   Copyright 2020 Vircadia Contributors
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

'use strict';

import { disallow } from 'feathers-hooks-common';
import checkAccessToAccount from '../../hooks/checkAccess';
import requestFail from '../../hooks/requestFail';
import requestSuccess from '../../hooks/requestSuccess';
import { Perm } from '../../utils/Perm';
import config from '../../appconfig';
import { iff } from 'feathers-hooks-common';
import isHasAuthToken from '../../hooks/isHasAuthToken';
import { findProfileSchema, joiReadOptions } from './profiles.joi';
import validators from '@feathers-plus/validate-joi';
import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;

export default {
    before: {
        all: [iff(isHasAuthToken(), authenticate('jwt'))],
        find: [validators.form(findProfileSchema, joiReadOptions)],
        get: [
            checkAccessToAccount(config.dbCollections.accounts, [
                Perm.PUBLIC,
                Perm.OWNER,
                Perm.ADMIN,
            ]),
        ],
        create: [disallow()],
        update: [disallow()],
        patch: [disallow()],
        remove: [disallow()],
    },

    after: {
        all: [requestSuccess()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },

    error: {
        all: [requestFail()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
};
