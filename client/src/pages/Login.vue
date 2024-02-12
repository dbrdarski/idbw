<template>
    <div class="flex flex-center window-height">
        <q-card flat bordered class="my-card" style="width: 300px">
            <q-card-section>
                <div class="text-h6">Login</div>
            </q-card-section>
            <q-card-section class="q-py-0">
                <q-input v-model="username" label="Username" name="username" filled dense />
                <br />
                <q-input v-model="password" type="password" label="Password" name="password" filled dense />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn color="grey-7" flat unelevated>Register</q-btn>
                <q-btn color="primary" fill unelevated @click="login">Login</q-btn>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script>
import api from "/src/api/client.js"
import { auth } from "src/stores/atoms/auth"

export default {
    name: "LoginPage",
    data() {
        return {
            username: "",
            password: ""
        }
    },
    methods: {
        async login() {
            const { username, password } = this
            const result = await api.auth.login({ username, password })
            console.log({ result })
            if (result) {
                const { token, user } = result
                auth.setToken(token)
                auth.setUser(user)
                this.$router.replace({ name: "posts" })
            }
        }
    }
}
</script>
