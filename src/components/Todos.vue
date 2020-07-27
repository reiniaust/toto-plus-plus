<template>
<section>
    <navigation></navigation>
    <h5 class="center-align">{{ !completed ? "Aufgaben" : "Erledigt" }}</h5>
    <span>
    </span>
    <ul class="collection with-header">
        <li v-show="!completed" class="collection-header">
            <div class="row">
                <div class="col s2">
                    <label>Titel:</label>
                </div>
                <div class="input-field col s10">
                    <input type="search" v-model="todo.title" />
                </div>
                <div class="col s2">
                    <label>Beschreibung:</label>
                </div>
                <div class="input-field col s10">
                    <input type="text" v-model="todo.description" />
                </div>
                <div class="col s2">
                    <label>Termin:</label>
                </div>
                <div class="input-field col s6">
                    <input type="date" v-model="todo.date" />
                </div>
                <span></span>
                <div class="input-field col s3">
                    <button class="btn" :disabled="todo.title == ''" @click="addToDo">Hinzufügen</button>
                </div>
                <div class="input-field col s3">
                    <button class="btn" :disabled="todo.id == null" @click="updateToDo">Ändern</button>
                </div>
            </div>
        </li>
        <li class="collection-item" v-for="todo in todos.filter(filterTodo)" :key="todo.id">
            <span class="deleteIcon" @click="deleteToDo(todo.id)">✕</span>
            <span @click="editToDo(todo)">
                {{(todo.date ? todo.date + "  " : "") + todo.title + " " + todo.description}}
            </span>
            <span class="secondary-content">
                <label>
                    <input type="checkbox" class="filled-in" :checked="todo.isCompleted"
                        @change="updateCompleted(todo.id, $event)" />
                    <span></span>
                </label>
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
                return t.isCompleted == this.completed && t.title.toUpperCase().includes(this.todo.title.toUpperCase())
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
            this.todo.id = null;
            this.todo.title = "";
            this.todo.description = "";
            this.todo.date = null;
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
        this.todo.id = null;
        this.todo.title = "";
        this.todo.description = "";
        this.todo.date = null;
        },
        editToDo(selected) {
            this.todo = Object.assign({}, selected)
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
        },
        deleteToDo(docId) {
        firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("todos")
            .doc(docId)
            .delete();
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
