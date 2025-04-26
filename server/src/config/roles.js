export const resources = {
    user: 'user',
    todo: 'todo',
    all: 'all',
};

export const actions = {
    create: 'create',
    update: 'update',
    read: 'read',
    delete: 'delete',
    readAll: 'readAll',
    readRelated: 'readRelated',
    manage: 'manage', // full access
};

export const roles = {
    user: [
        { action: actions.create, resource: resources.todo },
        { action: actions.readRelated, resource: resources.todo },
        { action: actions.update, resource: resources.todo },
        { action: actions.delete, resource: resources.todo },
        { action: actions.readRelated, resource: resources.user },
        { action: actions.update, resource: resources.user },
    ],
    admin: [
        { action: actions.manage, resource: resources.all },
    ],
};
