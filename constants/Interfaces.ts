export interface IncidentSaveData {
    incidentId: string;
    lastUpdate: string;
    messageId: string;
    resolved: boolean;
}

export type Languages =
    'de' |
    'en';

export type LoggerLogLevel =
    'DEBUG' |
    'ERROR' |
    'LOG' |
    'WARNING';

export interface StatusPageCheckerOptions {
    db: string;
    name: string;
    translations: typeof import('../translations/en').default,
    url: string;
}

export interface StatusPageData {
    incidents: StatusPageIncidentData[];
    page: StatusPagePageData;
}

export interface StatusPagePageData {
    id: string;
    name: string;
    time_zone: string;
    updated_at: string;
    url: string;
}

export interface StatusPageIncidentComponentData {
    created_at: string;
    description: string;
    group: boolean;
    group_id: string | null;
    id: string;
    name: string;
    only_show_if_degraded: boolean;
    page_id: string;
    position: number;
    showcase: boolean;
    start_date: string | null;
    status: string;
    updated_at: string;
}

export interface StatusPageIncidentComponentUpdateData {
    code: string;
    name: string;
    new_status: string;
    old_status: string;
}

export interface StatusPageIncidentData {
    components: StatusPageIncidentComponentData[];
    created_at: string;
    id: string;
    impact: StatusPageIncidentImpactType;
    incident_updates: StatusPageIncidentUpdateData[];
    monitoring_at: string | null;
    name: string;
    page_id: string;
    resolved_at: string | null;
    shortlink: string;
    started_at: string;
    status: StatusPageIncidentStatusType;
    updated_at: string | null;
}

export interface StatusPageIncidentUpdateData {
    affected_components: StatusPageIncidentComponentUpdateData[];
    body: string;
    created_at: string;
    custom_tweet: string | null;
    deliver_notifications: boolean;
    display_at: string;
    id: string;
    incident_id: string;
    status: string;
    tweet_id: string | null;
    updated_at: string;
}

export type StatusPageIncidentImpactType =
    'none' |
    'minor' |
    'major' |
    'critical';

export type StatusPageIncidentStatusType =
    'investigating' |
    'identified' |
    'monitoring' |
    'postmortem' |
    'resolved';
