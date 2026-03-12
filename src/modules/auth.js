import { supabase } from "../lib/supabase.js";

/**
 * Autentica un usuario con email y contraseña.
 */
export async function signIn(email, password) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		throw error;
	}

	return data;
}

/**
 * Cierra la sesión del usuario actual.
 */
export async function signOut() {
	const { error } = await supabase.auth.signOut();
	if (error) {
		throw error;
	}
}

/**
 * Obtiene el usuario actualmente autenticado desde la sesión en memoria.
 */
export async function getUser() {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}

/**
 * Escucha cambios en el estado de autenticación (login, logout, token refresh).
 */
export function onAuthStateChange(callback) {
	return supabase.auth.onAuthStateChange((event, session) => {
		callback(event, session);
	});
}

/**
 * Obtiene el rol del usuario conectado consultando la tabla user_roles.
 */
export async function getUserRole(userId) {
	if (!userId) return null;

	const { data, error } = await supabase
		.from("user_roles")
		.select("role")
		.eq("user_id", userId)
		.single();

	if (error) {
		console.error("Error obteniendo rol del usuario:", error);
		return null;
	}

	return data?.role;
}
