<template>
<section>
    <navigation></navigation>
    <h5 class="center-align">{{ (!todo.isCompleted ? "Offene" : "Erledigte") + " Aufgaben" }}</h5>
    <span>
    </span>
    <ul class="collection with-header">
        <li class="collection-header">
            <div class="row">
                <div class="input-field col s12">
                    <input type="text" placeholder="Titel" v-model="todo.title" />
                </div>
                <div class="input-field col s12">
                    <input type="text" placeholder="Beschreibung" v-model="todo.description" />
                </div>
                <div class="col s2">
                    <label>Termin:</label>
                </div>
                <div class="col s4">
                    <input type="date" v-model="todo.date" />
                </div>
                <div class="col s3">
                    <label>Erledigt:</label>
                </div>
                <div class="col s3">
                    <label>
                        <input type="checkbox" v-model="todo.isCompleted" />
                        <span></span>
                    </label>
                </div>
                <div class="col s12" />
                <div class="col s3">
                    <button class="btn" :disabled="todo.title == ''" @click="addToDo">Anlegen</button>
                </div>
                <div class="col s3">
                    <button class="btn" :disabled="todo.id == null" @click="updateToDo">Ändern</button>
                </div>
                <div class="col s3">
                    <button class="btn" :disabled="todo.id == null" @click="deleteToDo">Löschen</button>
                </div>
                <div class="col s3">
                    <button class="btn" :disabled="todo.title == ''" @click="initToDo">Abbrechen</button>
                </div>
            </div>
        </li>
        <li class="collection-item" v-for="todo in todos.filter(filterTodo)" :key="todo.id">
            <span class="title" @click="editToDo(todo)">{{todo.title}}</span>
            <!-- 
            <p v-show="todo.description" class="secondary-content">{{todo.description}}</p>
            -->
            <span class="secondary-content">{{(todo.date ? new Date(todo.date).toLocaleDateString() : "")}}</span>
            <br>
        </li>
    </ul>
</section>
</template>

<script>
import navigation from "@/components/NavBar.vue"; 
import firebase from "firebase";
export default { 
    name: "Todos",
    props: {
        completed: Boolean
    },
    components: { navigation },
    data() {
        return {
            todo: {
                id: null,
                title: "",
                description: "",
                date: null,
                isCompleted: false
            },
            todos: [],
            filterTodo: (t) => {
                let ok = (t.isCompleted == this.todo.isCompleted);
                // Suche nach mehr als einem Wort
                this.todo.title.toUpperCase().split(" ") .forEach(word => {
                    if (!t.title.toUpperCase().includes(word)) {
                        ok = false
                    }
                });
                return ok;
            }
        };
    },
    created() {
        this.getTodos();
    },
    methods: {
        async getTodos() {
            var todosRef = await firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("todos")
                .orderBy("date");

            todosRef.onSnapshot(snap => {
                this.todos = [];
                snap.forEach(doc => {
                    var todo = doc.data();
                    todo.id = doc.id;
                    this.todos.push(todo);
                });
            });
        },
        editToDo(selected) {
            this.todo = Object.assign({}, selected)
        },
        addToDo() {
            firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("todos")
                .add({
                    title: this.todo.title,
                    description: this.todo.description,
                    date: this.todo.date,
                    isCompleted: this.todo.isCompleted,
                })
            this.initToDo();
        },
        updateToDo() {
            firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("todos")
                .doc(this.todo.id)
                .update({
                    title: this.todo.title,
                    description: this.todo.description,
                    date: this.todo.date,
                    isCompleted: this.todo.isCompleted
                });
            this.initToDo();
        },
        deleteToDo() {
        firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("todos")
            .doc(this.todo.id)
            .delete();
            this.initToDo();
        },
        initToDo() {
            this.todo.id = null;
            this.todo.title = "";
            this.todo.description = "";
            this.todo.date = null;
            this.isCompleted = false;
        }
    }
}; 
</script>

<style>
.collection.with-header {
    max-width: 500px;
    margin: 0 auto;
}
.deleteIcon {
    margin-right: 10px;
    cursor: pointer;
}
.deleteIcon:hover {
    opacity: 0.5;
}
</style>
