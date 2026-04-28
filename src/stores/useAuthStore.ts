import type { User } from "@supabase/supabase-js";
import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import type { Role } from "@/types";

export const useAuthStore = defineStore("auth", () => {
	const user = ref<User | null>(null);
	const role = ref<Role | null>(null);
	const isInitializing = ref(true);

	let initPromise: Promise<void> | null = null;

	async function fetchUserRole(userId: string): Promise<Role | null> {
		try {
			const { data, error } = await supabase
				.from("user_roles")
				.select("role")
				.eq("user_id", userId)
				.single();

			if (error) {
				console.error("Error fetching user role:", error);
				return null;
			}
			return (data as any)?.role as Role;
		} catch (err) {
			console.error("Error exception fetching user role:", err);
			return null;
		}
	}

	async function initialize() {
		if (initPromise) return initPromise;

		initPromise = (async () => {
			isInitializing.value = true;
			console.log("🔐 Inicializando Auth State...");

			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session?.user) {
				user.value = session.user;
				role.value = await fetchUserRole(session.user.id);
			} else {
				user.value = null;
				role.value = null;
			}

			isInitializing.value = false;

			// Listen for auth changes (solo una vez)
			supabase.auth.onAuthStateChange(async (event, session) => {
				console.log("🔄 Auth State Change:", event);
				if (session?.user) {
					user.value = session.user;
					role.value = await fetchUserRole(session.user.id);
				} else {
					user.value = null;
					role.value = null;
				}
			});
		})();

		return initPromise;
	}

	async function signOut() {
		await supabase.auth.signOut();
		user.value = null;
		role.value = null;
	}

	return {
		user,
		role,
		isInitializing,
		initialize,
		signOut,
	};
});
