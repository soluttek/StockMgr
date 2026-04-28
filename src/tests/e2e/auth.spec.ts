import { expect, test } from "@playwright/test";

test.describe("Autenticación", () => {
	test("debe mostrar la pantalla de login correctamente", async ({ page }) => {
		await page.goto("/login");

		await expect(page.locator("h2")).toContainText("Bienvenido");
		await expect(page.locator('input[type="email"]')).toBeVisible();
		await expect(page.locator('input[type="password"]')).toBeVisible();
		await expect(page.locator("button.btn-login")).toBeVisible();
	});

	test("debe mostrar error con credenciales vacías", async ({ page }) => {
		await page.goto("/login");

		await page.click("button.btn-login");

		// Debería aparecer el modal de advertencia (custom modal)
		await expect(page.locator(".modal-content")).toBeVisible();
		await expect(page.locator(".modal-content p")).toContainText(
			"Por favor, introduce tu email corporativo",
		);
	});

	test("debe permitir escribir en los campos", async ({ page }) => {
		await page.goto("/login");

		await page.fill('input[type="email"]', "test@example.com");
		await page.fill('input[type="password"]', "password123");

		await expect(page.locator('input[type="email"]')).toHaveValue(
			"test@example.com",
		);
		await expect(page.locator('input[type="password"]')).toHaveValue(
			"password123",
		);
	});

	test("debe mostrar error de credenciales incorrectas (Mocked)", async ({
		page,
	}) => {
		// Interceptar la llamada a Supabase Auth
		await page.route("**/auth/v1/token*", async (route) => {
			await route.fulfill({
				status: 400,
				contentType: "application/json",
				body: JSON.stringify({
					error: "invalid_grant",
					error_description: "Invalid login credentials",
				}),
			});
		});

		await page.goto("/login");
		await page.fill('input[type="email"]', "wrong@example.com");
		await page.fill('input[type="password"]', "wrongpass");
		await page.click("button.btn-login");

		await expect(page.locator(".error-text")).toContainText(
			"Credenciales incorrectas",
		);
	});
});
