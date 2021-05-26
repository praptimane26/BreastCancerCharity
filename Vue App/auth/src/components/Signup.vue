<template>
    <div>
        NAME: <input type="text" v-model="name"/> <br/>
        EMAIL: <input type="text" v-model="email" /> <br/>
        PASSWORD: <input type="text" v-model="password" /> <br/>
        <button @click="signup" >Signup</button>
    </div>
</template>
<script>
export default {
    name: 'Signup',
    data() {
        return {
        name:'',
        email:'',
        password:''
        }
    },
    methods: {
        signup() {
            console.log(this.name);
            console.log(this.email);
            console.log(this.password);
        }
    }
}
</script>
