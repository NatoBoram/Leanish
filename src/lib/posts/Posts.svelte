<script lang="ts">
	import type {
		BlockCommunityResponse,
		BlockPersonResponse,
		CommunityModeratorView,
		CommunityResponse,
		CommunityView,
		Language,
		MyUserInfo,
		PersonView,
		PostView,
		Site,
	} from 'lemmy-js-client'
	import Post from '$lib/posts/Post.svelte'

	let className: string | undefined = undefined
	export { className as class }

	export let allLanguages: Language[]
	export let communityView: CommunityView | undefined
	export let jwt: string | undefined
	export let moderators: CommunityModeratorView[]
	export let myUser: MyUserInfo | undefined
	export let personView: PersonView | undefined
	export let postViews: PostView[]
	export let site: Site

	function onBlockCommunity(event: BlockCommunityResponse) {
		if (!event.blocked) return
		postViews = postViews.filter(
			postView => postView.community.id !== event.community_view.community.id,
		)

		if (!myUser) return
		myUser.community_blocks.push({
			community: event.community_view.community,
			person: myUser.local_user_view.person,
		})
		myUser = myUser
	}

	function onBlockPerson(event: BlockPersonResponse) {
		if (!event.blocked) return

		if (!personView)
			postViews = postViews.filter(postView => postView.creator.id !== event.person_view.person.id)

		if (!myUser) return
		myUser.person_blocks.push({
			target: event.person_view.person,
			person: myUser.local_user_view.person,
		})
		myUser = myUser
	}

	function onFollowCommunity(event: CommunityResponse) {
		if (!myUser) return
		myUser.follows.push({
			community: event.community_view.community,
			follower: myUser.local_user_view.person,
		})
	}
</script>

<div class="flex flex-col gap-4 {className}">
	{#each postViews as postView (postView.post.id)}
		<Post
			{allLanguages}
			{communityView}
			{jwt}
			{moderators}
			{myUser}
			{personView}
			{postView}
			{site}
			{onBlockCommunity}
			{onBlockPerson}
			{onFollowCommunity}
		/>
	{/each}
</div>
