import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { setInterval } from 'node:timers';
import axios from 'axios';
import { EmbedBuilder, WebhookClient, resolveColor } from 'discord.js';
import { Logger } from './Logger';
import { CheckTime, Colors, Webhook } from '../config';
import { IncidentSaveData, StatusPageCheckerOptions, StatusPageData, StatusPageIncidentData } from '../constants/Interfaces';

export class StatusPageChecker {
    public file: Array<IncidentSaveData>;
    public incidents: Array<IncidentSaveData>;
    public options: StatusPageCheckerOptions;
    public webhook: WebhookClient;

    constructor(options: StatusPageCheckerOptions) {
        this.options = options;

        if (!existsSync(this.options.db)) {
            copyFileSync(
                resolve(__dirname, '../db/default.json'),
                this.options.db,
            );
        }

        this.file = require(this.options.db);
        this.incidents = [];
        this.webhook = new WebhookClient({ url: Webhook });

        for (const entry of this.file) {
            this.incidents.push(entry);
        }

        Logger.log(this.options.translations.LISTENING_ON.replace('{{URL}}', this.options.url));

        this.check();
        setInterval(() => this.check(), CheckTime);
    }

    public async check(): Promise<boolean> {
        Logger.log(this.options.translations.CHECKING.replace('{{NAME}}', this.options.name));

        try {
            const data = await (await axios.get(`${this.options.url}/api/v2/incidents.json`)).data as StatusPageData;
            const { incidents } = data;

            for (const incident of incidents.reverse()) {
                const incidentData = this.incidents.find(i => i.incidentId === incident.id);

                if (!incidentData) {
                    Logger.log(this.options.translations.NEW_INCIDENT.replace('{{NAME}}', this.options.name).replace('{{ID}}', incident.id));
                    this.updateIncident(incident);
                    continue;
                }

                const incidentUpdate = new Date(Date.parse(incident.updated_at ?? incident.created_at));

                if (new Date(Date.parse(incidentData.lastUpdate)) < incidentUpdate) {
                    Logger.log(this.options.translations.NEW_INCIDENT_UPDATE.replace('{{NAME}}', this.options.name).replace('{{ID}}', incident.id));
                    this.updateIncident(incident, incidentData.messageId);
                }
            }
            return true;
        } catch (e) {
            Logger.error(this.options.translations.FAILED_TO_CHECK.replace('{{NAME}}', this.options.name));
            Logger.error(`${e}`);
            Logger.error(this.options.translations.WAITING_FOR_NEXT_CHECK);
            return false;
        }
    }

    public generateEmbed(incident: StatusPageIncidentData): EmbedBuilder {
        const incidentEmbed = new EmbedBuilder()
            .setTitle(incident.name)
            .setFooter({ text: incident.id })
            .setTimestamp(new Date(incident.started_at))
            .setURL(incident.shortlink);

        const incidentEmbedColor = incident.status === 'postmortem' || incident.status === 'resolved'
            ? Colors.GREEN
            : incident.impact === 'critical'
            ? Colors.RED
            : incident.impact === 'major'
            ? Colors.ORANGE
            : incident.impact === 'minor'
            ? Colors.YELLOW
            : Colors.GRAY;

        incidentEmbed.setColor(resolveColor(incidentEmbedColor));

        const affectedComponents = incident.components.map(c => c.name);

        for (const incidentUpdate of incident.incident_updates.reverse()) {
            const incidentUpdateDate = new Date(Date.parse(incidentUpdate.created_at));
            incidentEmbed.addFields({
                name: `${incidentUpdate.status.charAt(0).toUpperCase()}${incidentUpdate.status.slice(1)} (<t:${Math.floor(incidentUpdateDate.getTime() / 1000)}:R>)`,
                value: incidentUpdate.body,
            });
        }

        const incidentEmbedDescription = [`・${this.options.translations.IMPACT}: ${incident.impact}`];

        if (affectedComponents && affectedComponents.length > 0) incidentEmbedDescription.push(`・${this.options.translations.AFFECTED_COMPONENTS}: ${affectedComponents.join(', ')}`);

        incidentEmbed.setDescription(incidentEmbedDescription.join('\n'));

        return incidentEmbed;
    }

    public async updateIncident(incident: StatusPageIncidentData, messageId?: string): Promise<void> {
        const incidentEmbed = this.generateEmbed(incident);

        try {
            const incidentMessage = await (messageId ? this.webhook.editMessage(messageId, { embeds: [incidentEmbed] }) : this.webhook.send({ embeds: [incidentEmbed] }));

            Logger.log(this.options.translations.NEW_INCIDENT_MESSAGE.replace('{{MID}}', incidentMessage.id).replace('{{NAME}}', this.options.name).replace('{{ID}}', incident.id));

            this.incidents = this.incidents.filter(i => i.incidentId !== incident.id);

            this.incidents.push({
                incidentId: incident.id,
                lastUpdate: new Date(Date.now()).toISOString(),
                messageId: incidentMessage.id,
                resolved: incident.status === 'postmortem' || incident.status === 'resolved',
            });

            await writeFileSync(this.options.db, JSON.stringify(this.incidents));
        } catch (e) {
            if (messageId) {
                Logger.error(this.options.translations.FAILED_TO_EDIT.replace('{{MID}}', messageId).replace('{{ID}}', incident.id).replace('{{NAME}}', this.options.name));
                Logger.error(`${e}`);
            }
            Logger.error(this.options.translations.FAILED_TO_SEND.replace('{{ID}}', incident.id).replace('{{NAME}}', this.options.name));
            Logger.error(`${e}`);
        }
    }
}
