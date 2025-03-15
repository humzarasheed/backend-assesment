<?php

namespace Database\Seeders;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (PermissionEnum::cases() as $permission) {
            Permission::create(['name' => $permission->value]);
        }

        foreach (RoleEnum::cases() as $roleEnum) {
            $role = Role::create(['name' => $roleEnum->value]);

            switch($roleEnum) {
                case RoleEnum::AUTHOR:
                    $role->givePermissionTo(Permission::all());
                    break;


                case RoleEnum::COLLABORATOR:
                    $role->givePermissionTo([
                        PermissionEnum::VIEW_BOOK->value,
                    ]);
                    break;
            }
        }
    }
}
