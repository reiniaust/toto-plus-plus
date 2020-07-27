<template>
    <nav>
        <div class="nav-wrapper">
            <ul id="nav-mobile" class="right">
                <li v-show="user">
                    <router-link to="/todosopen">Offen</router-link>
                </li>
                <li v-show="user">
                    <router-link to="/todoscompleted">Erledigt</router-link>
                </li>
                <li v-show="!user">
                    <router-link to="/login">Login</router-link>
                </li>
                <li v-show="user">
                    <router-link to="/profile">Profil</router-link>
                </li>
                <li v-show="user">
                    <a @click="signoutButtonPressed">Logout</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import firebase from "firebase";
export default {
    data() {
        return {
            user: null
        };
    },
    created() {
        firebase.auth().onAuthStateChanged(user => {
            this.user = user;
        });
    },
    methods: {
        signoutButtonPressed(e) {
            e.stopPropagation();
            firebase.auth().signOut();
            this.$router.push({ name: "Login" });
        }
    }
};
</script>

