<script lang="ts">
	import CommunitySidebar from '$lib/community/CommunitySidebar.svelte'
	import Post from '$lib/posts/Post.svelte'
	import type { PageData } from './$types.js'
	import BgColourTest from './BgColourTest.svelte'

	export let data: PageData
</script>

<div class="container mx-auto mt-32 flex flex-col items-center gap-4">
	<div>
		<h1 class="text-4xl font-bold">Debug</h1>
	</div>

	<div>
		<h2 class="text-2xl font-bold">Elements</h2>
	</div>

	<div class="flex flex-row gap-2">
		<Post
			class="container mx-auto"
			allLanguages={[]}
			communityView={undefined}
			jwt={undefined}
			moderators={[]}
			myUser={undefined}
			personView={undefined}
			postView={data.post.post_view}
			site={data.site.site_view.site}
		/>

		<CommunitySidebar
			class=""
			communityView={data.post.community_view}
			jwt={undefined}
			myUser={undefined}
			siteView={data.site.site_view}
		/>
	</div>

	<div>
		<h2 class="text-2xl font-bold">Colours</h2>
	</div>

	<!-- Base -->
	<BgColourTest class="bg-base text-on-base" title="Base" message="All elements are on the base." />

	<BgColourTest
		class="bg-base-container text-on-base-container"
		title="Base Container"
		message="Elements on the base may be inside of a container."
	/>

	<!-- Surface -->
	<BgColourTest
		class="bg-surface text-on-surface"
		title="Surface"
		message="It heavily contrasts with the base colour."
	/>

	<BgColourTest
		class="bg-surface-container text-on-surface-container"
		title="Surface Container"
		message="It slightly contrasts with the base container colour."
	/>

	<!-- Muted -->
	<BgColourTest
		class="bg-muted text-on-muted"
		title="Muted"
		message="For disabled or unimportant elements."
	/>

	<!-- Primary -->
	<BgColourTest
		class="bg-primary text-on-primary"
		title="Primary"
		message="This is the primary colour."
	/>

	<BgColourTest
		class="bg-primary-container text-on-primary-container"
		title="Primary Container"
		message="This is the colour of a primary container."
	/>

	<!-- Secondary -->
	<BgColourTest
		class="bg-secondary text-on-secondary"
		title="Secondary"
		message="This is the secondary colour."
	/>

	<BgColourTest
		class="bg-secondary-container text-on-secondary-container"
		title="Secondary Container"
		message="This is the colour of a secondary container."
	/>

	<!-- Success -->
	<BgColourTest
		class="bg-success text-on-success"
		title="Success"
		message="This is the colour of success."
	></BgColourTest>

	<BgColourTest
		class="bg-success-container text-on-success-container"
		title="Success Container"
		message="This contains success."
	/>

	<!-- Warning -->
	<BgColourTest
		class="bg-warning text-on-warning"
		title="Warning"
		message="This is the colour of warnings."
	/>

	<BgColourTest
		class="bg-warning-container text-on-warning-container"
		title="Warning Container"
		message="Are you sure you want to proceed?"
	/>

	<!-- Danger -->
	<BgColourTest
		class="bg-danger text-on-danger"
		title="Danger"
		message="This is the colour of danger."
	/>

	<BgColourTest
		class="bg-danger-container text-on-danger-container"
		title="Danger Container"
		message="This action will permanently delete something."
	/>
</div>
