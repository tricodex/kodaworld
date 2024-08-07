"""Remove LearningGoal model and relationships

Revision ID: 9a612849bb6c
Revises: 9a05723ede64
Create Date: 2024-08-07 16:05:51.873826

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9a612849bb6c'
down_revision: Union[str, None] = '9a05723ede64'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop foreign key constraints first
    op.drop_constraint('learning_goals_user_id_fkey', 'learning_goals', type_='foreignkey')
    op.drop_constraint('learning_goals_curriculum_id_fkey', 'learning_goals', type_='foreignkey')
    
    # Drop the learning_goals table
    op.drop_table('learning_goals')
    
    # Update the type of user_id columns in other tables
    op.alter_column('conversation_history', 'user_id',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=True)
    op.alter_column('performance_data', 'user_id',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=True)
    op.alter_column('recommendations', 'user_id',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=True)
    op.alter_column('user_achievements', 'user_id',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=True)
    op.alter_column('user_engagements', 'user_id',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=True)
    op.alter_column('user_profiles', 'user_id',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=True)


def downgrade() -> None:
    # Recreate the learning_goals table
    op.create_table('learning_goals',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('curriculum_id', sa.Integer(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('goal', sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(['curriculum_id'], ['curriculums.id'], name='learning_goals_curriculum_id_fkey'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='learning_goals_user_id_fkey'),
        sa.PrimaryKeyConstraint('id', name='learning_goals_pkey')
    )
    
    # Revert the type of user_id columns in other tables
    op.alter_column('user_profiles', 'user_id',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=True)
    op.alter_column('user_engagements', 'user_id',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=True)
    op.alter_column('user_achievements', 'user_id',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=True)
    op.alter_column('recommendations', 'user_id',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=True)
    op.alter_column('performance_data', 'user_id',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=True)
    op.alter_column('conversation_history', 'user_id',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=True)
