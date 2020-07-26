<template>
    <Todos completed=true></Todos>
</template>

<script>
import Todos from './components/Todos'
export default {
    name: "TodosCompleted",
    components: {
        Todos
    }
}
</script>