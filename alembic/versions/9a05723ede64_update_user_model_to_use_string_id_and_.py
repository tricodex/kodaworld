"""Update User model to use String id and other changes

Revision ID: 9a05723ede64
Revises: d012c4d46f62
Create Date: 2024-08-07 13:40:16.248022

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9a05723ede64'
down_revision: Union[str, None] = 'd012c4d46f62'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Dropping foreign key constraints
    op.drop_constraint('conversation_history_user_id_fkey', 'conversation_history', type_='foreignkey')
    op.drop_constraint('performance_data_user_id_fkey', 'performance_data', type_='foreignkey')
    op.drop_constraint('learning_goals_user_id_fkey', 'learning_goals', type_='foreignkey')
    op.drop_constraint('user_achievements_user_id_fkey', 'user_achievements', type_='foreignkey')
    op.drop_constraint('user_engagements_user_id_fkey', 'user_engagements', type_='foreignkey')
    op.drop_constraint('user_profiles_user_id_fkey', 'user_profiles', type_='foreignkey')
    op.drop_constraint('recommendations_user_id_fkey', 'recommendations', type_='foreignkey')
    
    # Altering foreign key columns to match new type
    op.alter_column('conversation_history', 'user_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=False)
    op.alter_column('performance_data', 'user_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=False)
    op.alter_column('learning_goals', 'user_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=False)
    op.alter_column('user_achievements', 'user_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=False)
    op.alter_column('user_engagements', 'user_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=False)
    op.alter_column('user_profiles', 'user_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=False)
    op.alter_column('recommendations', 'user_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=False)

    # Altering 'users.id' to VARCHAR
    op.alter_column('users', 'id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=False,
               existing_server_default=sa.text("nextval('users_id_seq'::regclass)"))

    # Re-adding foreign key constraints
    op.create_foreign_key('conversation_history_user_id_fkey', 'conversation_history', 'users', ['user_id'], ['id'])
    op.create_foreign_key('performance_data_user_id_fkey', 'performance_data', 'users', ['user_id'], ['id'])
    op.create_foreign_key('learning_goals_user_id_fkey', 'learning_goals', 'users', ['user_id'], ['id'])
    op.create_foreign_key('user_achievements_user_id_fkey', 'user_achievements', 'users', ['user_id'], ['id'])
    op.create_foreign_key('user_engagements_user_id_fkey', 'user_engagements', 'users', ['user_id'], ['id'])
    op.create_foreign_key('user_profiles_user_id_fkey', 'user_profiles', 'users', ['user_id'], ['id'])
    op.create_foreign_key('recommendations_user_id_fkey', 'recommendations', 'users', ['user_id'], ['id'])

    # Dropping column
    op.drop_column('users', 'hashed_password')


def downgrade() -> None:
    # Dropping foreign key constraints
    op.drop_constraint('conversation_history_user_id_fkey', 'conversation_history', type_='foreignkey')
    op.drop_constraint('performance_data_user_id_fkey', 'performance_data', type_='foreignkey')
    op.drop_constraint('learning_goals_user_id_fkey', 'learning_goals', type_='foreignkey')
    op.drop_constraint('user_achievements_user_id_fkey', 'user_achievements', type_='foreignkey')
    op.drop_constraint('user_engagements_user_id_fkey', 'user_engagements', type_='foreignkey')
    op.drop_constraint('user_profiles_user_id_fkey', 'user_profiles', type_='foreignkey')
    op.drop_constraint('recommendations_user_id_fkey', 'recommendations', type_='foreignkey')
    
    # Reverting foreign key columns to original type
    op.alter_column('conversation_history', 'user_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=False)
    op.alter_column('performance_data', 'user_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=False)
    op.alter_column('learning_goals', 'user_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=False)
    op.alter_column('user_achievements', 'user_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=False)
    op.alter_column('user_engagements', 'user_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=False)
    op.alter_column('user_profiles', 'user_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=False)
    op.alter_column('recommendations', 'user_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=False)

    # Reverting 'users.id' to INTEGER
    op.alter_column('users', 'id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=False,
               existing_server_default=sa.text("nextval('users_id_seq'::regclass)"))

    # Re-adding foreign key constraints
    op.create_foreign_key('conversation_history_user_id_fkey', 'conversation_history', 'users', ['user_id'], ['id'])
    op.create_foreign_key('performance_data_user_id_fkey', 'performance_data', 'users', ['user_id'], ['id'])
    op.create_foreign_key('learning_goals_user_id_fkey', 'learning_goals', 'users', ['user_id'], ['id'])
    op.create_foreign_key('user_achievements_user_id_fkey', 'user_achievements', 'users', ['user_id'], ['id'])
    op.create_foreign_key('user_engagements_user_id_fkey', 'user_engagements', 'users', ['user_id'], ['id'])
    op.create_foreign_key('user_profiles_user_id_fkey', 'user_profiles', 'users', ['user_id'], ['id'])
    op.create_foreign_key('recommendations_user_id_fkey', 'recommendations', 'users', ['user_id'], ['id'])

    # Reverting column drop
    op.add_column('users', sa.Column('hashed_password', sa.VARCHAR(), autoincrement=False, nullable=False))
