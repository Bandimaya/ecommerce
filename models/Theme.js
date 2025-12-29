// models/Theme.ts
import { Schema, model, models } from "mongoose";

const ThemeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // e.g., "Midnight Pro"
        },
        isPublic: {
            type: Boolean,
            default: true, // True if all users can see/use it
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // Tracks which admin created this theme
        },
        config: {
            color: {
                type: String,
                required: true,
                enum: ["red", "orange", "green", "teal", "blue", "purple", "mono"]
            },
            gradient: {
                type: String,
                default: null,
                enum: ["sunset", "ocean", "aurora", "fire", "forest", "royal", "mono", null]
            },
            font: {
                type: String,
                default: "'Inter', sans-serif"
            },
            fontSizes: {
                sm: { type: Number, default: 0.875 },
                base: { type: Number, default: 1 },
                lg: { type: Number, default: 1.125 },
                xl: { type: Number, default: 1.25 },
                xl2: { type: Number, default: 1.5 },
                xl3: { type: Number, default: 1.875 },
                xl4: { type: Number, default: 2.25 },
                xl5: { type: Number, default: 3 },
            }
        }
    },
    { timestamps: true }
);

const Theme = models.Theme || model("Theme", ThemeSchema);

export default Theme;
