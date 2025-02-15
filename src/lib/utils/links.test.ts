import type { Comment, Community, Person, Post, Site } from 'lemmy-js-client'
import { describe, test } from 'vitest'
import {
	commentLink,
	communityLink,
	communityUri,
	personLink,
	personUri,
	postLink,
	siteHostname,
	siteLink,
} from './links.ts'

type TestComment = Pick<Comment, 'id'>
type TestCommunity = Pick<Community, 'actor_id' | 'name'>
type TestPerson = Pick<Person, 'actor_id' | 'name'>
type TestPost = Pick<Post, 'id'>
type TestSite = Pick<Site, 'actor_id'>

const comment = { id: 123 } satisfies TestComment as Comment
const community = {
	actor_id: 'https://lemmy.world/c/leanish',
	name: 'leanish',
} satisfies TestCommunity as Community
const person = {
	actor_id: 'https://lemmy.world/u/NatoBoram',
	name: 'NatoBoram',
} satisfies TestPerson as Person
const post = { id: 456 } satisfies TestPost as Post
const site = { actor_id: 'https://lemm.ee/' } satisfies TestSite as Site

describe.concurrent('links', () => {
	test('commentLink', ({ expect }) => {
		const link = commentLink(site, post, comment)
		expect(link).toBe('/lemm.ee/post/456?parent_id=123')
	})

	test('communityLink', ({ expect }) => {
		const link = communityLink(site, community)
		expect(link).toBe('/lemm.ee/c/leanish@lemmy.world')
	})

	test('communityUri', ({ expect }) => {
		const uri = communityUri(community)
		expect(uri).toBe('leanish@lemmy.world')
	})

	test('personLink', ({ expect }) => {
		const link = personLink(site, person)
		expect(link).toBe('/lemm.ee/u/NatoBoram@lemmy.world')
	})

	test('personUri', ({ expect }) => {
		const uri = personUri(person)
		expect(uri).toBe('NatoBoram@lemmy.world')
	})

	test('postLink', ({ expect }) => {
		const link = postLink(site, post)
		expect(link).toBe('/lemm.ee/post/456')
	})

	test('siteLink', ({ expect }) => {
		const link = siteLink(site)
		expect(link).toBe('/lemm.ee')
	})

	test('siteHostname', ({ expect }) => {
		const hostname = siteHostname(site)
		expect(hostname).toBe('lemm.ee')
	})
})
