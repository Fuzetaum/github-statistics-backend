drop table if exists contribution;
drop table if exists repository;
drop table if exists github_user;
create table github_user (
  username varchar(30) primary key not null
);

create table repository (
  name varchar(30) not null,
  owner varchar(30) not null,
  fully_loaded boolean default false,
  currentCursor varchar(50) default null,
  primary key (name, owner),
  foreign key (owner) references github_user(username)
);

create table contribution (
  username varchar(30) not null,
  repository varchar(30) not null,
  owner varchar(30) not null,
  commits int not null default 0,
  added int not null default 0,
  removed int not null default 0,
  primary key (username, repository),
  foreign key (username) references github_user(username),
  foreign key (repository) references repository(name),
  foreign key (owner) references repository(owner)
);