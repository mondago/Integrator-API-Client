export namespace Integrator {
	export interface Config {
		https: boolean
		name: string
		id: string
	}
	export interface Response<T> {
		status: number
		isOkay: boolean
		data?: T
		error?: {
			Message: string
		}
	}
	export namespace DoAction {
		export interface Body {
			actionId: string
		}
	}

	export namespace Register {
		export interface Body {
			Name: string
			Id: string
		}
	}

	export namespace Search {
		export interface Body {
			query: string
			count?: number
			offset?: number
			includePictures?: boolean
			includeActivities?: boolean
		}
		export type Response = AddinCollection[]
	}

	export namespace SearchPeers {
		export type Body = Search.Body
		export type Response = PeerRecord[]
	}

	export interface PeerRecord {
		Id: string
		Contact: {
			Id: string
			DialString: string
			DisplayTel: string
			DisplayName: string
			Type: string
		}
		EmailAddress?: string
	}

	export interface AddinCollection {
		AddinId: string
		Records: ContactRecord[]
		ExceptionText: string
	}

	export interface ContactRecord {
		UniqueId: string
		RecordType: string
		DisplayText: string
		Fields: ContactRecordField[]
		Actions: ContactRecordAction[]
	}

	export interface ContactRecordField {
		Name: string
		Value: any
		WellKnownName: string
		DescriptorId: string
		Type: string
		Ordinal: number
	}

	export interface ContactRecordAction {
		UniqueId: string
		ActionId: string
		IsMultiple: boolean
		UseDefaultImage: boolean
		DisplayText: string
		SpecialKind: string

		Number?: number
		Icon?: {
			MimeType: string
			Buffer64: string
		}
	}

	export namespace AddressBooks {
		export type Response = AddressBook[]
	}

	export interface AddressBook {
		Priority: number
		CrmAddinTypeId: string
		AddinId: string
		Cached: boolean
		Enabled: boolean
		Name: string
		CacheFrequencyMinutes: number
		IsPersistent: boolean
		Description: string
		HasModifyFeature: boolean
		HasCursorFeature: boolean
		HasSearchFeature: boolean
		HasActivityActionFeatureCreate: boolean
		HasActivityActionFeatureShow: boolean
		HasActionFeatureShow: boolean
		ShowActivityOnCall: boolean
		CreateActivityOnCallEnd: boolean
		AutoPopOption: string
		Type: {
			AddinTypeId: string
			TypeFullName: string
			AssemblyLocation: string
			IsLegacy: boolean
			IsUnrecognized: boolean
			IsCloudContacts: boolean
			LegacyCursorFeature: boolean
			LegacySearchFeature: boolean
			LegacyActionFeature: boolean
			LegacyActivityFeatureCreate: boolean
			LegacyActivityFeatureShow: boolean
		}
	}

	export interface License {
		Key: string
		Name: string
		Value: number
		ExpiresAt: string
	}

	export namespace Version {
		export interface Response {
			ProductName: string
			ProductVersion: string
			Licenses: License[]
		}
	}

	export namespace MakeCall {
		export interface Body {
			destination: string
		}
		export interface Response {
			StartTimeUtc: string
			UniqueId: string
			CallerContact: {
				Id: string
				DialString: string
				Department: string
				DisplayTel: string
				DisplayName: string
				Type: string
				InternalContactType: string
			}
			CalledContact: {
				Id: string
				DialString: string
				E164: string
				DisplayTel: string
				DisplayName: string
				Type: string
				InternalContactType: string
			}
			Direction: string
			CallState: string
			CallActions: string
			Completed: boolean
			Id: string
			Participants: unknown[]
		}
	}

	export namespace ShowWindow {
		export interface Body {
			window: 'configuration' | 'callhistory'
		}
	}

	export namespace OwnerContact {
		export interface Response {
			Id: string
			DialString: string
			E164: string
			DisplayTel: string
			DisplayName: string
			Type: string
			InternalContactType: string
		}
	}

	export interface RecordType {
		RelatedRecordTypes: unknown[]
		HasEmail: boolean
		HasFirstNameLastName: boolean
		AddinId: string
		HasContactName: boolean
		HasCompanyName: boolean
		HasNotes: boolean
		CanShowInEditMode: boolean
		CanCreate: boolean
		UniqueId: string
		RecordTypeId: string
		Name: string
		IsResidential: boolean
	}

	export namespace RecordTypes {
		export type Response = RecordType[]
	}

	interface CallAction {
		callId: string
	}

	export namespace Hangup {
		export type Body = CallAction
	}
	export namespace TransferComplete {
		export type Body = CallAction
	}
	export namespace TransferConsult {
		export type Body = CallAction
	}
	export namespace TransferCancel {
		export type Body = CallAction
	}
	export namespace TransferBlind {
		export type Body = CallAction
	}
	export namespace SendDtmf {
		export type Body = CallAction
	}
	export namespace Deflect {
		export type Body = CallAction
	}
	export namespace Hold {
		export type Body = CallAction
	}
	export namespace Unhold {
		export type Body = CallAction
	}
	export namespace Pickup {
		export type Body = CallAction
	}

	export type HookState = 'Offline' | 'DoNotDisturb' | 'Dialtone' | 'OnHook' | 'OffHook' | 'Ringing' | 'Held'

	export namespace HookState {
		export interface Body {
			hookState: HookState
		}
	}

	export namespace CreateNewRecord {
		export interface Body {
			RecordTypeId: string
		}
		export type Response = ContactRecord
	}

	export namespace SaveRecord {
		export interface Body extends Record<string, string> {
			RecordTypeId: string
		}
		export type Response = ContactRecord
	}

	export namespace Ping {
		export interface Body {
			Id: string
		}
		export interface Response {
			Id: string
		}
	}
}
