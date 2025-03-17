<?php

namespace Database\Factories;

use App\Models\Section;
use App\Models\Book;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Section>
 */
class SectionFactory extends Factory
{
    protected $model = Section::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'book_id' => Book::factory(),
            'user_id' => User::factory(),
            'updated_by' => null,
            'parent_id' => null,
        ];
    }

    public function withParent(Section $parent)
    {
        return $this->state(function (array $attributes) use ($parent) {
            return [
                'parent_id' => $parent ? $parent->id : Section::factory(),
            ];
        });
    }
}
