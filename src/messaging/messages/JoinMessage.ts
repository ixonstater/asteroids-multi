import { ShipColor, ShipColorConversion } from "../../game/ship/Ship";
import {
    GenericMessage,
    MessageSegment,
    MessageTypeCodes,
} from "../GenericMessage";
import { MessageUtils } from "../MessageUtils";

export class JoinMessage {
    private _shipColor: ShipColor = ShipColor.RED;

    constructor(shipColor: ShipColor) {
        this._shipColor = shipColor;
    }

    public toRequest(): Uint8Array {
        const stringSegments: MessageSegment<string>[] = [];
        stringSegments.push(new MessageSegment<string>(MessageTypeCodes.join));
        stringSegments.push(
            new MessageSegment<string>(
                ShipColorConversion.colorCodeFromShipColor(this._shipColor)
            )
        );

        return MessageUtils.serialize(
            GenericMessage.genericMessage(stringSegments, null)
        );
    }
}
