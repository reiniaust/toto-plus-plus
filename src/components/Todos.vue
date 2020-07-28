<template>
<section>
    <navigation></navigation>
    <h5 class="center-align">{{ !completed ? "Offene Aufgaben" : "Erledigt" }}</h5>
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
                <div class="col s4">
                    <label>Termin:</label>
                </div>
                <div class="input-field col s8">
                    <input type="date" v-model="todo.date" />
                </div>
                <span></span>
                <div class="input-field col s4">
                    <button class="btn" :disabled="todo.title == ''" @click="addToDo">Hinzufügen</button>
                </div>
                <div class="input-field col s3">
                    <button class="btn" :disabled="todo.id == null" @click="updateToDo">Ändern</button>
                </div>
                <div class="input-field col s4">
                    <button class="btn" :disabled="todo.title == ''" @click="initToDo">Abbrechen</button>
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
        initToDo() {
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
