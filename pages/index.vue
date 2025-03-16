<template>
	<v-container>
		<LinkCreationForm />
		<LinkList />
	</v-container>
</template>

<script setup lang="ts">
import LinkList from '../components/LinkList.vue';
import LinkCreationForm from '../components/LinkCreationForm.vue';
</script>