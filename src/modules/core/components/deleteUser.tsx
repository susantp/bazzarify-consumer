"use client";

import { actionDeleteUser } from "@/modules/core/actions";
import { useActionState } from "react";

export default function DeleteUser() {
	const [state, formAction] = useActionState(actionDeleteUser, {
		status: 0,
		message: "",
	});
	return (
		<div className="flex w-full items-center justify-center h-screen bg-slate-200">
			<form
				className="flex flex-col space-y-7 bg-white w-xl p-4 rounded-lg"
				action={formAction}
			>
				<div>
					<p className="text-red-600 font-bold">{state?.message}</p>
				</div>
				<div>
					<input
						className="ring-primary border border-gray-300 rounded-md p-2 w-full"
						name="phone"
						type="text"
						placeholder="Enter your 10 digit phone number"
						pattern="\d{10}"
						required
					/>
				</div>
				<div>
					<button
						type="submit"
						className="px-2 py-1 bg-orange-600 text-white rounded-lg active:translate-y-0.5 active:scale-98 active:shadow-none"
					>
						Delete
					</button>
				</div>
			</form>
		</div>
	);
}
