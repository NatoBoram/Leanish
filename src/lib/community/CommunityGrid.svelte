<script lang="ts">
	import { communityLink, communityUri } from '$lib/utils/index.js'
	import { EyeSlash, NoSymbol, ShieldCheck, Trash } from '@natoboram/heroicons.svelte/24/solid'
	import type {
		BlockCommunityResponse,
		CommunityResponse,
		CommunityView,
		Site,
	} from 'lemmy-js-client'
	import CommunityIcon from './CommunityIcon.svelte'
	import CommunityMeatballs from './CommunityMeatballs.svelte'

	interface Props {
		readonly class?: string | undefined
		readonly communityViews: CommunityView[]
		readonly jwt: string | undefined
		readonly onBlockCommunity: (response: BlockCommunityResponse) => void
		readonly onError?: (error: Error) => void
		readonly onFollowCommunity: (response: CommunityResponse) => void
		readonly onResponse?: (response: Response) => void
		readonly site: Site
	}

	let {
		class: className = undefined,
		communityViews,
		jwt,
		onBlockCommunity,
		onError = () => {},
		onFollowCommunity,
		onResponse = () => {},
		site,
	}: Props = $props()
</script>

<div class="w-full overflow-x-auto">
	<table class="w-full table-auto border-separate border-spacing-4 {className}">
		<!-- Titles -->
		<thead>
			<tr>
				<th class="text-start">Name</th>
				<th class="max-sm:hidden">Subscribers</th>
				<th class="max-md:hidden">Posts</th>
				<th class="max-lg:hidden">Comments</th>
				<th class=""></th>
			</tr>
		</thead>

		<tbody>
			{#each communityViews as communityView (communityView.community.id)}
				<tr>
					<td>
						<a
							class="flex flex-row items-center gap-4"
							href={communityLink(site, communityView.community)}
							data-community-id={communityView.community.id}
						>
							<CommunityIcon community={communityView.community} class="h-11 w-11" />

							<div class="flex flex-col">
								<h2 class="text-lg font-bold">
									{communityView.community.title}

									{#if communityView.community.nsfw}
										<span
											class="w-fit rounded-full bg-danger px-2 py-1 text-xs font-semibold text-on-danger"
										>
											NSFW
										</span>
									{/if}

									{#if communityView.blocked}
										<span title="Blocked">
											<NoSymbol class="inline h-6 w-6 text-danger" />
										</span>
									{/if}

									{#if communityView.community.deleted}
										<span title="Deleted">
											<Trash class="inline h-6 w-6" />
										</span>
									{/if}

									{#if communityView.community.removed}
										<span title="Removed">
											<Trash class="inline h-6 w-6 text-danger" />
										</span>
									{/if}

									{#if communityView.community.hidden}
										<span title="Hidden">
											<EyeSlash class="inline h-6 w-6" />
										</span>
									{/if}

									{#if communityView.community.posting_restricted_to_mods}
										<span title="Posting restricted to mods">
											<ShieldCheck class="inline h-6 w-6" />
										</span>
									{/if}
								</h2>

								<div>{communityUri(communityView.community)}</div>
							</div>
						</a>
					</td>

					<td class="text-center max-sm:hidden">
						{communityView.counts.subscribers}
					</td>

					<td class="text-center max-md:hidden">
						{communityView.counts.posts}
					</td>

					<td class="text-center max-lg:hidden">
						{communityView.counts.comments}
					</td>

					<td class="text-center">
						{#if jwt}
							<CommunityMeatballs
								{communityView}
								{jwt}
								{onBlockCommunity}
								{onError}
								{onFollowCommunity}
								{onResponse}
								communityId={communityView.community.id}
								position="right-8 -top-4"
							/>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
