const summery = {


    signup : {
        url : '/auth/signup',
        method: 'post'
    },
    login : {
        url : '/auth/login',
        method : 'post'
    }, 
    logout : {
        url : '/auth/logout',
        method: 'get'
    },
    forgotPassword : {
        url : '/auth/forgotpassword',
        method : 'post'
    },
    resetPassword : {
        url : '/auth/reset-password',
        method: 'post'
    },
    loginRefresh: {
        url: '/auth/login-refresh',
        method: 'get'
    },


    getUser : {
        url : '/user/get',
        method : 'get'
    },
    getAllUsers : {
        url : '/user',
        method : 'get'
    },
    deleteUser : {
        url : '/user',
        method : 'delete'
    },
    roleUpdate : {
        url : '/user',
        method : 'patch'
    },


    // Todo Paths
    createTodo : {
        url: '/todos',
        method: 'post'
    },
    editTodo : {
        url : '/todos',
        method: 'patch'
    },
    getAllTodos : {
        url: '/todos',
        method: 'get'
    },
    getByid : {
        url: '/todos',
        method: 'get'
    },
    deleteTodo : {
        url : '/todos',
        method: 'delete'
    },


    //dashboard apis
    getsingleuserbarchart : {
        url : '/dashboard/singleuserbarchart',
        method : 'get'
    },
    getalluserbarchart : {
        url : '/dashboard/getalluserbarchart',
        method: 'get'
    },
    getpiechart: {
        url : '/dashboard/getpiechart',
        method: 'get'
    },
    getallpiechart: {
        url : '/dashboard/getallpiechart',
        method: 'get'
    },

    
    gettotaltodos:{
        url : '/dashboard/gettotaltodos',
        method: 'get'
    },

    gettotaltodosuser:{
        url : '/dashboard/gettotal-todosuser',
        method: 'get'
    },
    
    upload: {
        url : '/todos/upload',
        method: 'post'
    },
    googleLogin: {
        url: '/auth/google/callback',
        method: 'get'
    }
}

export default summery