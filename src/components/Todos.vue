<template>
<section>
    <navigation></navigation>
    <h5 class="center-align">{{ !completed ? "Offene Aufgaben" : "Erledigt" }}</h5>
    <span>
    </span>
                    <input type="checkbox" />
                    <span></span>

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
                <div class="col s5">
                    <input type="date" v-model="todo.date" />
                </div>
                <div class="col s2">
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
            <span @click="editToDo(todo)">
                {{(todo.date ? todo.date + "  " : "") + todo.title + " " + todo.description}}
            </span>
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
            },
            todos: [],
            filterTodo: (t) => {
                let ok = (t.isCompleted == this.completed);
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
                    isCompleted: false,
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
        },
        updateCompleted(docId, e) {
            var isChecked = e.target.checked;
            firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("todos")
                .doc(docId)
                .update({
                    isCompleted: isChecked
                });
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
