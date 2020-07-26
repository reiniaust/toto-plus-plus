<template>
    <Todos completed=false></Todos>
</template>

<script>
import Todos from './components/Todos'
export default {
    name: "TodosOpen",
    components: {
        Todos
    }
}
</script>