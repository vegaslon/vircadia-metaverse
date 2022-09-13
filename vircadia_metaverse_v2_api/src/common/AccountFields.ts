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

import { Perm } from '../utils/Perm';
import Joi from '@hapi/joi';
import config from '../appconfig';
import { Availability } from './sets/Availability';
import { Roles } from './sets/Roles';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { IsNullOrEmpty, genRandomString } from '../utils/Misc';
import { DatabaseService } from '../common/dbservice/DatabaseService';
import app from '../app';
import { isValidObject } from '../utils/Utils';
import {
    isStringValidator,
    isBooleanValidator,
    isDateValidator,
    isPathValidator,
    verifyAllSArraySetValues,
    simpleSetter,
    noOverwriteSetter,
    sArraySetter,
    isNumberValidator,
    isSArraySet,
    simpleGetter,
} from '../utils/Validators';

// Naming and access for the fields in a AccountEntity.
// Indexed by request_field_name.
export const AccountFields: { [key: string]: any } = {
    id: {
        entity_field: 'id',
        request_field_name: 'id',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.NONE],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    username: {
        entity_field: 'username',
        request_field_name: 'username',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: async (
            value: string,
            loginUser?: any,
            entryDataArray?: any
        ) => {
            let validity: boolean;
            const dbService = new DatabaseService({}, app);

            const schema = Joi.string()
                .max(config.metaverseServer.maxNameLength)
                .regex(/^[A-Za-z][A-Za-z0-9+\-_\.]*$/);
            const { error } = schema.validate(value);

            if (!error) {
                const otherAccount = await dbService.findDataToArray(
                    config.dbCollections.accounts,
                    { query: { username: value } }
                );

                if (
                    IsNullOrEmpty(otherAccount) ||
                    entryDataArray.id === otherAccount[0].id
                ) {
                    validity = true;
                } else {
                    validity = false;
                    throw new Error('username already exists');
                }
            } else {
                validity = false;
                throw new Error(error.message);
            }
            return validity;
        },
        setter: simpleSetter,
        getter: simpleGetter,
    },
    email: {
        entity_field: 'email',
        request_field_name: 'email',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: async (
            value: string,
            loginUser?: any,
            entryDataArray?: any
        ) => {
            let validity: boolean;
            const dbService = new DatabaseService({}, app);
            const schema = Joi.string().email();
            const { error } = schema.validate(value);

            if (!error) {
                const otherAccount = await dbService.findDataToArray(
                    config.dbCollections.accounts,
                    { query: { email: value } }
                );
                if (
                    IsNullOrEmpty(otherAccount) ||
                    entryDataArray.id === otherAccount[0].id
                ) {
                    validity = true;
                } else {
                    validity = false;
                    throw new Error('email already exists for another account');
                }
            } else {
                validity = false;
                throw new Error(error.message);
            }
            return validity;
        },
        setter: simpleSetter,
        getter: simpleGetter,
    },
    account_settings: {
        entity_field: 'accountSettings',
        request_field_name: 'account_settings',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    images_hero: {
        entity_field: 'imagesHero',
        request_field_name: 'images_hero',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    images_tiny: {
        entity_field: 'imagesTiny',
        request_field_name: 'images_tiny',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    images_thumbnail: {
        entity_field: 'imagesThumbnail',
        request_field_name: 'images_thumbnail',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    connected: {
        entity_field: 'locationConnected',
        request_field_name: 'connected',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isBooleanValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    path: {
        entity_field: 'locationPath',
        request_field_name: 'path',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isPathValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    place_id: {
        entity_field: 'locationPlaceId',
        request_field_name: 'place_id',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    domain_id: {
        entity_field: 'locationDomainId',
        request_field_name: 'domain_id',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    network_address: {
        entity_field: 'locationNetworkAddress',
        request_field_name: 'network_address',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    network_port: {
        entity_field: 'locationNetworkPort',
        request_field_name: 'network_port',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isNumberValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    node_id: {
        entity_field: 'locationNodeId',
        request_field_name: 'node_id',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    availability: {
        entity_field: 'availability',
        request_field_name: 'availability',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: async (pVal: any): Promise<any> => {
            let validity: boolean;
            if (
                await verifyAllSArraySetValues(
                    pVal,
                    Availability.KnownAvailability
                )
            ) {
                validity = true;
            } else {
                validity = false;
                throw new Error('Not legal availability value');
            }
            return validity;
        },
        setter: sArraySetter,
        getter: simpleGetter,
    },
    connections: {
        entity_field: 'connections',
        request_field_name: 'connections',
        get_permissions: [Perm.OWNER, Perm.ADMIN, 'friend', 'connection'],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isSArraySet,
        setter: sArraySetter,
        getter: simpleGetter,
    },
    friends: {
        entity_field: 'friends',
        request_field_name: 'friends',
        get_permissions: [Perm.OWNER, Perm.ADMIN, 'friend'],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isSArraySet,
        setter: sArraySetter,
        getter: simpleGetter,
    },
    locker: {
        entity_field: 'locker',
        request_field_name: 'locker',
        get_permissions: [Perm.OWNER, Perm.ADMIN],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isValidObject,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    profile_detail: {
        entity_field: 'profileDetail',
        request_field_name: 'profile_detail',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isValidObject,
        setter: simpleSetter,
        getter: simpleGetter,
    },

    // User authentication
    password: {
        entity_field: 'password',
        request_field_name: 'password',
        get_permissions: [Perm.NONE],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: async (
            pField: any,
            pEntity: any,
            pVal: any,
            updates: any
        ): Promise<any> => {
            const passwordSalt = genRandomString(16);
            const hash = crypto.createHmac('sha512', passwordSalt);
            hash.update(pVal);
            const val = hash.digest('hex');
            updates['passwordSalt'] = passwordSalt;
            updates['passwordHash'] = val;
        },
    },
    public_key: {
        entity_field: 'sessionPublicKey',
        request_field_name: 'public_key',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },

    // Old stuff
    xmpp_password: {
        entity_field: 'xmppPassword',
        request_field_name: 'xmpp_password',
        get_permissions: [Perm.OWNER],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    discourse_api_key: {
        entity_field: 'discourseApiKey',
        request_field_name: 'discourse_api_key',
        get_permissions: [Perm.OWNER],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    wallet_id: {
        entity_field: 'walletId',
        request_field_name: 'wallet_id',
        get_permissions: [Perm.OWNER],
        set_permissions: [Perm.OWNER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },

    // Admin stuff
    roles: {
        entity_field: 'roles',
        request_field_name: 'roles',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.ADMIN],
        validate: async (pVal: any): Promise<any> => {
            let validity: boolean;
            if (await verifyAllSArraySetValues(pVal, Roles.KnownRole)) {
                validity = true;
            } else {
                validity = false;
                throw new Error('not valid role name');
            }
            return validity;
        },
        setter: sArraySetter,
        getter: simpleGetter,
    },
    ip_addr_of_creator: {
        entity_field: 'IPAddrOfCreator',
        request_field_name: 'ip_addr_of_creator',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.NONE],
        validate: isStringValidator,
        setter: '',
        getter: simpleGetter,
    },
    when_account_created: {
        entity_field: 'whenCreated',
        request_field_name: 'when_account_created',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.NONE],
        validate: isDateValidator,
        setter: '',
        getter: async (pEntity: any, pField: any): Promise<any> => {
            if (pEntity && pEntity.hasOwnProperty(pField)) {
                const dateValue = pEntity[pField];
                return dateValue ? dateValue.toISOString() : undefined;
            }
            return undefined;
        },
    },
    time_of_last_heartbeat: {
        entity_field: 'timeOfLastHeartbeat',
        request_field_name: 'time_of_last_heartbeat',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.ADMIN],
        validate: isDateValidator,
        setter: '',
        getter: async (pEntity: any, pField: any): Promise<any> => {
            if (pEntity && pEntity.hasOwnProperty(pField)) {
                const dateValue = pEntity[pField];
                return dateValue ? dateValue.toISOString() : undefined;
            }
            return undefined;
        },
    },
};
