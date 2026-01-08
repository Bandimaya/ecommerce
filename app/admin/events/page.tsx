"use client";

import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast"; // Assuming you have a custom toast hook
import { apiFetch } from "@/lib/axios";
import { IMAGE_URL } from "@/lib/constants";
import AdminButton from "@/components/admin/AdminButton";

interface EventFormState {
    _id?: string;
    title: string;
    subtitle: string;
    category: string;
    thumbnail: string;
    logo: File | null;
    color: string;
    bgGradient: string;
    count: string;
}

interface Event {
    _id: string;
    title: string;
    subtitle: string;
    category: string;
    thumbnail: string;
    logo: string;
    color: string;
    bgGradient: string;
    count: string;
}

export default function CreateEventForm() {
    const [formData, setFormData] = useState<EventFormState>({
        title: "",
        subtitle: "",
        category: "",
        thumbnail: "",
        color: "#f97316", // Default color
        bgGradient: "from-orange-500/20 via-orange-100/50 to-white",
        count: "0",
        logo: null,
    });
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);

    // Fetch existing events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("/api/events");
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
                toast({ title: "Error fetching events", variant: "destructive" });
            }
        };
        fetchEvents();
    }, []);

    // Handle form field changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle logo image change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
        if (e.target.files?.[0]) {
            setFormData((prev) => ({ ...prev, logo: e.target.files?.[0] }));
        }
    };

    // Handle form submit (Create or Update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check for required fields
        if (!formData.title || !formData.subtitle || !formData.category || (!formData.logo && !formData._id)) {
            toast({ title: "Please fill all required fields", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const form = new FormData();
            form.append("title", formData.title);
            form.append("subtitle", formData.subtitle);
            form.append("category", formData.category);
            form.append("thumbnail", formData.thumbnail);
            if (formData.logo)
                form.append("logo", formData.logo);
            form.append("color", formData.color);
            form.append("bgGradient", formData.bgGradient);
            form.append("count", formData.count);

            let response;
            // If _id exists, it's an update, otherwise, create a new event
            if (formData._id) {
                form.append("id", formData._id);
                response = await apiFetch(`/events`, {
                    method: "PUT",
                    data: form,
                });
            } else {
                response = await apiFetch("/events", {
                    method: "POST",
                    data: form,
                });
            }

            toast({ title: "Event saved successfully!", variant: "success" });
            // Reset form data
            setFormData({
                title: "",
                subtitle: "",
                category: "",
                thumbnail: "",
                logo: null,
                color: "#f97316",
                bgGradient: "from-orange-500/20 via-orange-100/50 to-white",
                count: "0",
            });

            // Update the events list
            setEvents((prevEvents: any) => {
                if (formData._id) {
                    return prevEvents.map((event: any) =>
                        event._id === formData._id ? response : event
                    );
                } else {
                    return [...prevEvents, response];
                }
            });
        } catch (error) {
            console.error("Error:", error);
            toast({ title: "An error occurred while saving the event", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // Handle event deletion
    const handleDelete = async (id: string) => {
        try {
            const response = await apiFetch(`/events`, {
                method: "DELETE",
                data: { id: id }
            });

            toast({ title: "Event deleted successfully", variant: "success" });
            setEvents(events.filter((event) => event._id !== id)); // Remove event from state
        } catch (error) {
            console.error("Error deleting event:", error);
            toast({ title: "Error deleting event", variant: "destructive" });
        }
    };

    // Handle event editing
    const handleEdit = (event: Event) => {
        setFormData({
            _id: event._id,
            title: event.title,
            subtitle: event.subtitle,
            category: event.category,
            thumbnail: event.thumbnail,
            logo: null, // Will need to handle logo editing differently (if you want to replace it)
            color: event.color,
            bgGradient: event.bgGradient,
            count: event.count,
        });
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">{formData._id ? "Edit Event" : "Create Event"}</h2>
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Event Title"
                        required
                    />
                </div>

                {/* Subtitle */}
                <div className="mb-4">
                    <label htmlFor="subtitle" className="block text-sm font-medium">Subtitle</label>
                    <input
                        type="text"
                        id="subtitle"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Event Subtitle"
                        required
                    />
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium">Category</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Event Category"
                        required
                    />
                </div>

                {/* Thumbnail */}
                <div className="mb-4">
                    <label htmlFor="thumbnail" className="block text-sm font-medium">Thumbnail URL</label>
                    <input
                        type="text"
                        id="thumbnail"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Thumbnail Image URL"
                    />
                </div>

                {/* Color */}
                <div className="mb-4">
                    <label htmlFor="color" className="block text-sm font-medium">Color</label>
                    <input
                        type="color"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-16 h-10 p-2 border rounded"
                    />
                </div>

                {/* Background Gradient */}
                <div className="mb-4">
                    <label htmlFor="bgGradient" className="block text-sm font-medium">Background Gradient</label>
                    <input
                        type="text"
                        id="bgGradient"
                        name="bgGradient"
                        value={formData.bgGradient}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Background Gradient"
                    />
                </div>

                {/* Count */}
                <div className="mb-4">
                    <label htmlFor="count" className="block text-sm font-medium">Attendees Count</label>
                    <input
                        type="number"
                        id="count"
                        min={0}
                        name="count"
                        value={formData.count}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        placeholder="Number of Attendees"
                    />
                </div>

                {/* Image */}
                <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium">Event Image</label>
                    <input
                        type="file"
                        id="logo"
                        name="logo"
                        onChange={handleImageChange}
                        className="p-2"
                        required={!formData._id} // Only require logo if creating a new event
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <AdminButton type="submit" loading={loading} className="px-4 py-2">
                        {formData._id ? "Update Event" : "Create Event"}
                    </AdminButton>
                </div>
            </form>

            {/* Event List */}
            <h2 className="text-xl font-semibold mt-8">Events List</h2>
            <div className="space-y-4 mt-4">
                {events.map((event) => (
                    <div key={event._id} className="p-4 border rounded">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-sm">{event.subtitle}</p>
                        <img src={IMAGE_URL + event?.logo} />
                        <div className="mt-2 flex space-x-4">
                            <AdminButton variant="ghost" onClick={() => handleEdit(event)} className="px-2 py-1">
                                Edit
                            </AdminButton>
                            <AdminButton
                                variant="danger"
                                loading={removingId === event._id}
                                onClick={async () => {
                                    if (!confirm("Are you sure you want to delete this event?")) return;
                                    setRemovingId(event._id);
                                    try {
                                        await handleDelete(event._id);
                                    } finally {
                                        setRemovingId(null);
                                    }
                                }}
                                className="px-2 py-1"
                            >
                                Delete
                            </AdminButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
